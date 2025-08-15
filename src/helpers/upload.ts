import cloudinary from "./cloudinary";
import { CLOUDINARY_FOLDER_NAME } from "../utils/keys";
import { Info, Message } from "../types/upload";
import { Request } from "express";

const folder = CLOUDINARY_FOLDER_NAME;

const message = (uploadedCount: number, errors: string[]): string => {
  return `Uploaded ${uploadedCount} images. Errors: ${errors.join(", ")}`;
};

export const uploadSingle = async (image: string) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder,
    });
    return result;
  } catch (error) {
    const err = (error as Error).message;
    return { error: err };
  }
};

interface UploadMultipleResponse {
  images: string[];
  message?: string; // Optional message field
}

export const uploadMultiple = async (
  images: Express.Multer.File[], // More specific type
  req: Request
): Promise<UploadMultipleResponse> => {
  const imageUrls: string[] = [];
  const errors: string[] = [];

  // Validate the number of images
  if (!images || images.length < 1 || images.length > 8) {
    (req as Info<Message>).info = {
      message: !images
        ? "No images were provided!"
        : images.length < 1
        ? "At least one image is required!"
        : "Items can't have more than 8 images!",
    };
    return { images: [] }; // Return empty images array on validation failure
  }

  for (const image of images) {
    try {
      const data = await uploadSingle(image.path);
      if ("error" in data) {
        (req as Info<Message>).info = {
          message: "Uploading image failed!",
        };
      } else {
        imageUrls.push(data?.secure_url);
      }
    } catch (error: any) {
      errors.push(error.message);
      (req as Info<Message>).info = {
        message: message(imageUrls.length, errors) as string,
      };
    }
  }

  // If there were errors, you might want to return those in a message
  if (errors.length > 0) {
    return {
      images: imageUrls,
      message: message(imageUrls.length, errors) as string,
    };
  }

  return { images: imageUrls };
};

export const deleteCloudinaryFile = async (url: string) => {
  try {
    await cloudinary.uploader.destroy(url);
    return true;
  } catch (error) {
    return error;
  }
};
