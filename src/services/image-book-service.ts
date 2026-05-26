import { api } from "@/lib/api-client";

export interface BookImage {
  id: string;
  bookId: string;
  url: string;
  publicId: string;
}

export interface BookImageResponse {
  success: boolean;
  message?: string;
  data: BookImage[];
}

export const imageBookService = {
  // LƯU Ý: Endpoint /v1/book-images/book/:bookId hiện đã bị đóng (commented out) ở backend NestJS.
  // Chi tiết hình ảnh của sách được lấy trực tiếp thông qua API chi tiết sách (bookService.getBookById).
  getImagesByBookId: async (bookId: string): Promise<BookImageResponse> => {
    const response = await api.get<BookImageResponse>(`/v1/book-images/book/${bookId}`);
    return response.data;
  },

  uploadImages: async (bookId: string, files: File[]): Promise<BookImageResponse> => {
    const formData = new FormData();
    formData.append("bookId", bookId);
    
    // Bỏ trường "position" vì DTO trên NestJS (BookImageRequestDto) chỉ định nghĩa duy nhất "bookId".
    // Gửi thêm "position" sẽ kích hoạt ValidationPipe (forbidNonWhitelisted: true) và gây lỗi 400.
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post<BookImageResponse>("/v1/book-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteImage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/book-images/${id}`);
    return response.data;
  },
};

