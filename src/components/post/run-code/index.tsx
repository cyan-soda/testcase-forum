'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';
import iconRightArrow from '@/icons/arrow--right.svg';
import iconPlay from '@/icons/video-square.svg';
import { codeService } from '@/service/code';
import { useParams } from 'next/navigation';
import { usePostStore } from '@/store/post/post-store';
import { TPost } from '@/types/post';
import { postService } from '@/service/post';

// Field component (unchanged)
const Field = ({ label, value }: { label: string; value?: string }) => {
    return (
        <div className="flex flex-col items-start gap-2 w-full">
            <span className="text-xs font-semibold">{label}</span>
            <div className="rounded-lg bg-grey px-[10px] py-3 text-sm w-full" style={{ whiteSpace: 'pre-wrap' }}>
                {value}
            </div>
        </div>
    );
};

// RecPostItem component (unchanged)
const RecPostItem = ({ title, author, link }: { title: string; author: string; link: string }) => {
    return (
        <div 
            className="flex flex-row items-start gap-4 cursor-pointer hover:bg-grey p-3 rounded-lg w-full"
            onClick={() => window.open(link, '_blank')}
        >
            <div className="flex flex-col items-start gap-[6px] w-full">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs font-normal">{author}</span>
            </div>
            <Image src={iconRightArrow} alt="" width={20} height={20} />
        </div>
    );
};

const RunCode = () => {
    const [fileNames, setFileNames] = useState<{ hFile?: string; cppFile?: string }>({});
    const [isUploaded, setIsUploaded] = useState(false);
    const [isFileExist, setIsFileExist] = useState(false);
    const { postId } = useParams<{ postId: string }>();
    const [runState, setRunState] = useState<0 | 1 | 2>(0); // 0: not run, 1: passed, 2: failed
    const [output, setOutput] = useState<string>('None');
    const post = usePostStore().getPostById(postId);
    const [loadingRunCode, setLoadingRunCode] = useState<boolean>(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<TPost[]>([]);

    // Check if code files exist for the given postId
    useEffect(() => {
        const checkCodeFileExist = async () => {
            try {
                const response = await codeService.checkCodeFileExist();
                console.log('Check file existence response status:', response);
                if (response === 204) {
                    setIsFileExist(true);
                    setIsUploaded(true);
                } else {
                    setIsFileExist(false);
                    setIsUploaded(false);
                    setFileNames({});
                }
            } catch (error) {
                console.error('Error checking code file existence:', error);
                setIsFileExist(false);
                setIsUploaded(false);
                setFileNames({});
            }
        };

        if (postId) {
            checkCodeFileExist();
        }
    }, [postId]);

    // Fetch suggested posts after a code run (when output changes)
    useEffect(() => {
        const fetchRecommendedPosts = async () => {
            if (runState === 0) return; // Only fetch after a code run
            setLoadingSuggestions(true);
            try {
                const response = await postService.getSuggestedPosts();
                const recommendedPosts = response.filter((item: TPost) => item.id !== postId);
                setSuggestions(recommendedPosts);
            } catch (error) {
                console.error('Error fetching recommended posts:', error);
                setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        fetchRecommendedPosts();
    }, [runState, postId]); // Trigger when runState changes (after code run)

    const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        const files = Array.from(selectedFiles);
        const hFile = files.find((file) => file.name.endsWith('.h'));
        const cppFile = files.find((file) => file.name.endsWith('.cpp'));

        if (!hFile || !cppFile) {
            alert('Please upload both a .h and a .cpp file');
            return;
        }

        setFileNames({
            hFile: hFile.name,
            cppFile: cppFile.name,
        });

        try {
            const uploadResponse = await codeService.submitCodeFile(hFile, cppFile);
            console.log('Upload response:', uploadResponse);
            if (uploadResponse.success) {
                setIsUploaded(true);
                setIsFileExist(true);
                alert('Files uploaded successfully!');
            } else {
                alert(`Upload failed: ${uploadResponse.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Upload error:', error.message, error);
            alert(`Failed to upload files: ${error.message || 'Unknown error'}`);
        }
    };

    const handleRunCode = async () => {
        if (!isFileExist) {
            alert('Please upload your files first!');
            return;
        }
        try {
            setLoadingRunCode(true);
            setRunState(0);
            const result = await codeService.runCode(postId);
            if (result.error) {
                alert(`Error: ${result.error}`);
                return;
            }
            if (result.status === 200) {
                setRunState(result.score === 1 ? 1 : 2);
                setOutput(result.log);
            }
            console.log('Execution result:', result);
        } catch (error) {
            console.error('Run code failed:', error);
            alert('Failed to run code');
        } finally {
            setLoadingRunCode(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white text-black p-5 rounded-xl">
            <span className="font-semibold text-2xl">Try it out!</span>
            <div className="flex flex-row items-center gap-3 w-full mb-6 mt-3 text-base font-bold">
                <button
                    className="flex flex-row gap-2 px-4 py-3 rounded-lg bg-green"
                    onClick={handleRunCode}
                    disabled={loadingRunCode}
                >
                    {loadingRunCode ? 'Running...' : 'Run Code'}
                    <Image src={iconPlay} alt="" width={20} height={20} />
                </button>
                <label className="cursor-pointer px-4 py-3 rounded-lg bg-grey flex items-center gap-2">
                    Upload Files
                    <input type="file" multiple accept=".h,.cpp" className="hidden" onChange={handleUploadFiles} />
                </label>
                <div className="flex-1 w-full flex flex-row items-center border-black border rounded-lg border-dashed h-full p-3">
                    {isFileExist ? (
                        <span className="text-sm font-normal w-full text-center">
                            {fileNames.hFile && fileNames.cppFile
                                ? `Files uploaded: ${fileNames.hFile}, ${fileNames.cppFile}`
                                : 'Files exist in database. You can run the code or upload new files to replace them.'}
                        </span>
                    ) : fileNames.hFile || fileNames.cppFile ? (
                        <span className="text-sm font-normal w-full text-center">
                            {fileNames.hFile}
                            {fileNames.cppFile ? `, ${fileNames.cppFile}` : ''}
                        </span>
                    ) : (
                        <span className="text-sm font-normal w-full text-center">
                            No files uploaded yet. Please upload your .h and .cpp files.
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-row items-start gap-5">
                <div className="flex flex-col gap-5 items-start w-3/5">
                    <div className="flex flex-col p-4 items-start rounded-lg border border-black w-full">
                        <span className="text-xl font-semibold">Test Results</span>
                        {loadingRunCode ? (
                            <div className="w-full flex flex-col gap-1 items-center justify-center h-full">
                                <span className="text-sm font-normal">Executing...</span>
                                <span className="text-sm font-normal">Please wait a few seconds.</span>
                                <div className="flex items-center justify-center my-3">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mt-3 flex flex-row gap-3 items-center">
                                    <div className={`${runState === 1 ? 'bg-green' : 'bg-grey'} px-2 py-1 rounded-lg text-xs font-bold`}>Passed</div>
                                    <div className={`${runState === 2 ? 'bg-black text-white' : 'bg-grey'} px-2 py-1 rounded-lg text-xs font-bold`}>Failed</div>
                                </div>
                                <div className="mt-5 flex flex-col gap-2 items-start w-full">
                                    <Field label="Input" value={post?.testcase.input} />
                                    <Field label="Expected Output" value={post?.testcase.expected} />
                                    <Field label="Output" value={output.split('\n').join('\n')} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="rounded-lg border border-black py-5 px-3 w-2/5">
                    <span className="text-xl font-semibold p-3">Recommended Posts</span>
                    <div className="flex flex-col gap-1 mt-3">
                        {loadingSuggestions ? (
                            <div className="w-full flex flex-col gap-1 items-center justify-center h-full">
                                <span className="text-sm font-normal">Loading recommendations...</span>
                                <div className="flex items-center justify-center my-3">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                                </div>
                            </div>
                        ) : suggestions.length > 0 ? (
                            suggestions.map((item, index) => (
                                <RecPostItem key={index} title={item.title} author={item.author} link={`/space/CO1005/242/${item.id}`} />
                            ))
                        ) : (
                            <span className="text-sm font-normal text-center w-full">No recommendations available.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RunCode;