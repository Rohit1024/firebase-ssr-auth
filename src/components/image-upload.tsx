"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  getDownloadURL,
  StorageError,
  StorageReference,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { Icons } from "./icons";
import RadialProgress from "./ui/progress";
import { toast } from "sonner";

type UploadProps = {
  storageRef: StorageReference;
  uploadedImagePath: string | null | undefined;
  handleUploadedPath: Dispatch<SetStateAction<string | null | undefined>>;
};

export function ImageUpload({
  storageRef,
  uploadedImagePath,
  handleUploadedPath,
}: UploadProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const selectedImage = event.target.files[0];
      setSelectedImage(selectedImage);
      handleImageUpload(selectedImage);
    }
  };

  const removeSelectedImage = () => {
    setLoading(false);
    handleUploadedPath(null);
    setSelectedImage(null);
  };

  const onUploadProgress = (snapshot: UploadTaskSnapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setProgress(progress);
  };

  const handleImageUpload = (image: File) => {
    if (!image) return;
    setLoading(true);
    const metadata = {
      contentType: "image/jpeg",
    };
    try {
      const uploadTask = uploadBytesResumable(
        storageRef,
        selectedImage!,
        metadata
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => onUploadProgress(snapshot),
        (error) => {
          console.log(error);
          if (error instanceof StorageError) {
            toast.error(error.code);
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            handleUploadedPath(downloadURL);
          });
        }
      );
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedImage = acceptedFiles[0];
      setSelectedImage(selectedImage);
      handleImageUpload(selectedImage);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <Icons.fileUpload className="mr-2 h-4 w-4" size="1.2em" />
          <span className=" ml-2 text-sm">Upload Image</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=" mb-3">Upload Profile Picture</DialogTitle>
          <div
            {...getRootProps()}
            className=" flex items-center justify-center w-full"
          >
            <label
              htmlFor="dropzone-file"
              className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              {loading && (
                <div className=" text-center max-w-md  ">
                  <RadialProgress progress={progress} />
                  <p className=" text-sm font-semibold">Uploading Picture</p>
                  <p className=" text-xs text-gray-400">
                    Do not refresh or perform any other action while the picture
                    is being upload
                  </p>
                </div>
              )}

              {!loading && !uploadedImagePath && (
                <div className=" text-center">
                  <div className=" border p-2 rounded-md max-w-min mx-auto">
                    <Icons.cloudUpload size="1.6em" />
                  </div>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Drag an image</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400">
                    Click to upload &#40; image should be 500x500 px & under 10
                    MB &#41;
                  </p>
                </div>
              )}

              {uploadedImagePath && !loading && (
                <div className="text-center">
                  <Image
                    width={1000}
                    height={1000}
                    src={uploadedImagePath}
                    className=" w-full object-contain max-h-16 mx-auto mt-2 mb-3 opacity-70"
                    alt="uploaded image"
                  />
                  <p className=" text-sm font-semibold">Picture Uploaded</p>
                  <p className=" text-xs text-gray-400">
                    Click submit to upload the picture
                  </p>
                </div>
              )}
            </label>

            <Input
              {...getInputProps()}
              id="dropzone-file"
              accept="image/png, image/jpeg"
              type="file"
              className="hidden"
              disabled={loading || uploadedImagePath !== null}
              onChange={handleImageChange}
            />
          </div>
        </DialogHeader>

        <DialogFooter className=" flex items-center justify-end gap-x-2">
          <DialogClose asChild>
            <Button
              onClick={removeSelectedImage}
              type="button"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              // onClick={}
              disabled={!selectedImage || loading}
              size={"sm"}
              className=" text-sm"
            >
              {loading ? "Uploading..." : "Submit"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
