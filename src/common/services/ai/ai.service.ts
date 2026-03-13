import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AskDto } from './dto/ai.dto';
import { EnvVars } from '../../envs/validate.env';

import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AIService {
  private client: GoogleGenAI;
  constructor(private configService: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: configService.get<string>(EnvVars.GEMINI_API_KEY),
    });
  }

  async ask({ context, question, chatHistory }: AskDto) {
    const answer = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...chatHistory,
        {
          role: 'user',
          parts: [
            {
              text: `
                - CONTEXT:
                ${context}

                - QUESTION:
                ${question}
              `,
            },
          ],
        },
      ],

      config: {
        systemInstruction: `
          - Nguồn dữ liệu duy nhất được phép dùng để trả lời QUESTION là CONTEXT.
          - Nếu QUESTION thuộc:
          + Trường hợp 1: có một trong các từ khóa: 'xuất', 'excel', 'thêm vào giỏ hàng', 'thêm lại vào giỏ hàng', 'thêm giỏ hàng', 'thanh toán' thì trả về mảng theo mẫu: '[giá trị các id, ...]'. Ví dụ: '["1","2","3"]'.
          + Trường hợp 2: thì trả lời kết quả bằng ngôn ngữ tự nhiên của con người.
          - Nếu câu hỏi không có thông tin trong CONTEXT, hãy trả lời: "Tôi không có dữ liệu về câu hỏi của bạn".
        `,
      },
    });

    return answer.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }
}
