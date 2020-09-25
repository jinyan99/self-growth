import React, { FC, useRef, ChangeEvent, useState } from 'react';
import axios from 'axios';
import UploadList from './uploadList';
import Button from '../Button/button';
import Dragger from './dragger';

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';
// 描述数据列表中一系列文件状态的数据结构
export interface UploadFile {
	uid: string;
	size: number;
	name: string;
	status?: UploadFileStatus;
	percent?: number;
	raw?: File;
	response?: any;
	error?: any;
}

export interface UploadProps {
	action: string;
	defaultFileList?: UploadFile[];
	// 这块要返回2中可能结果一个是上传前做些验证返回验证结果，一种是上传前做些数据的转化，返回新的数据以待上传
	beforeUpload?: (file: File) => boolean | Promise<File>;
	onProgress?: (percentage: number, file: File) => void;
	onSuccess?: (data: any, file: File) => void;
	onError?: (err: any, file: File) => void;
	onChange?: (file: File) => void;
	onRemove?: (file: UploadFile) => void;
	headers?: { [key: string]: any }; // 牢记变量keyvalue类型这样写！
	name?: string;
	data?: { [key: string]: any };
	withCredentials?: boolean;
	accept?: string;
	multiple?: boolean;
	drag?: boolean;
}

export const Upload: FC<UploadProps> = (props) => {
	const {
		action,
		defaultFileList,
		onRemove,
		onProgress,
		onSuccess,
		onError,
		beforeUpload,
		onChange,
		name,
		headers,
		data,
		withCredentials,
		accept,
		multiple,
		children,
		drag
	} = props;
	const fileInput = useRef<HTMLInputElement>(null);
	const [fileList, setFileList] = useState<UploadFile[]>(
		defaultFileList || []
	);
	console.log(fileList);
	const updateFileList = (
		updateFile: UploadFile,
		updateObj: Partial<UploadFile>
	) => {
		setFileList((prevList) => {
			return prevList.map((file) => {
				if (file.uid === updateFile.uid) {
					return { ...file, ...updateObj };
				} else {
					return file;
				}
			});
		});
	};
	const handleClick = () => {
		if (fileInput.current) {
			// 记住这种dom手动触发点击事件方法
			fileInput.current.click();
		}
	};
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) {
			return;
		}
		uploadFiles(files);
		if (fileInput.current) {
			fileInput.current.value = '';
		}
	};
	const handleRemove = (file: UploadFile) => {
		setFileList((prevList) => {
			return prevList.filter((item) => item.uid !== file.uid);
		});
		if (onRemove) {
			onRemove(file);
		}
	};
	const uploadFiles = (files: FileList) => {
		const postFiles = Array.from(files);
		postFiles.forEach((file) => {
			if (!beforeUpload) {
				post(file);
			} else {
				const result = beforeUpload(file);
				if (result && result instanceof Promise) {
					result.then((processedFile) => {
						post(processedFile);
					});
				} else if (result !== false) {
					post(file);
				}
			}
		});
	};
	const post = (file: File) => {
		const _file: UploadFile = {
			uid: Date.now() + 'upload-file',
			status: 'ready',
			name: file.name,
			size: file.size,
			percent: 0,
			raw: file
		};
		// 当前file放在最前面，已存在的file利用展开运算符移后面
		// 下面这种方式在开启多文件上传时会有明明上传的两但实际上传了最后一个的bug，下面这种是异步的，这个post会多次调用，所以异步过来最后会拿到多文件的最后一个文件
		// setFileList([_file, ...fileList]);
		// 改写：
		setFileList((prevList) => {
			return [_file, ...prevList];
		});

		const formData = new FormData();
		formData.append(name || 'file', file);
		if (data) {
			Object.keys(data).forEach((key) => {
				formData.append(key, data[key]);
			});
		}
		axios
			.post(action, formData, {
				headers: {
					...headers,
					'Content-Type': 'multipart/form-data'
				},
				withCredentials, // axios本身就支持的直接放进来就行
				onUploadProgress: (e) => {
					const percentage =
						Math.round((e.loaded * 100) / e.total) || 0;
					if (percentage < 100) {
						console.log(fileList);
						updateFileList(_file, {
							percent: percentage,
							status: 'uploading'
						});
						if (onProgress) {
							onProgress(percentage, file);
						}
					}
				}
			})
			.then((resp) => {
				console.log(resp);
				updateFileList(_file, {
					status: 'success',
					response: resp.data
				});
				if (onSuccess) {
					onSuccess(resp.data, file);
				}
				if (onChange) {
					onChange(file);
				}
			})
			.catch((err) => {
				console.log(err);
				updateFileList(_file, { status: 'error', error: err });
				if (onError) {
					onError(err, file);
				}
				if (onChange) {
					onChange(file);
				}
			});
	};

	return (
		<div className="viking-upload-component">
			<div
				className="viking-upload-input"
				style={{ display: 'inline-block' }}
				onClick={handleClick}
			>
				{drag ? (
					<Dragger
						onFile={(files) => {
							uploadFiles(files);
						}}
					>
						{children}
					</Dragger>
				) : (
					children
				)}
			</div>
			{/* <Button btnType="primary" onClick={handleClick}>
				Upload File------改成用户自定义的点击上传控件样式
			</Button> */}
			<input
				className="viking-file-input"
				style={{ display: 'none' }}
				ref={fileInput}
				type="file"
				onChange={handleFileChange}
				accept={accept}
				multiple={multiple}
			/>
			<UploadList fileList={fileList} onRemove={handleRemove} />
		</div>
	);
};
Upload.defaultProps = {
	name: 'file'
};

export default Upload;
