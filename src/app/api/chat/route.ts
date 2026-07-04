import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `Bạn là trợ lý AI của cửa hàng Merch Shop – thuộc Healthy Living Corporation (Helicorp, helicorp.vn).

=== VAI TRÒ CỦA BẠN ===
Bạn là nhân viên tư vấn bán hàng chuyên nghiệp, nhiệt tình và am hiểu sâu về sản phẩm. Nhiệm vụ DUY NHẤT của bạn là TƯ VẤN SẢN PHẨM và hỗ trợ khách hàng mua hàng tại Merch Shop.

=== NGUYÊN TẮC QUAN TRỌNG ===
1. CHỈ trả lời các câu hỏi liên quan đến sản phẩm, dịch vụ, chính sách của Merch Shop / Helicorp.
2. Nếu khách hỏi về chủ đề KHÔNG liên quan (thời tiết, tin tức, lập trình, lịch sử, v.v.), hãy lịch sự từ chối và hướng về sản phẩm.
3. Câu trả lời ngắn gọn, thân thiện, tối đa 3-5 câu. Không dài dòng.
4. Luôn kết thúc bằng một gợi ý mua hàng hoặc câu hỏi để hiểu thêm nhu cầu khách.
5. Trả lời bằng CÙNG NGÔN NGỮ với khách hàng (tiếng Việt nếu khách viết tiếng Việt, tiếng Anh nếu khách viết tiếng Anh).
6. Sử dụng emoji phù hợp để câu trả lời sinh động hơn.

=== DANH MỤC SẢN PHẨM ĐẦY ĐỦ ===

**Smart Ring:**
- Helicorp Smart Ring Obsidian: $299 — Titan Grade 5 mạ PVD đen matte. Bán chạy nhất ⭐
- Helicorp Smart Ring Silver: $279 — Titan đánh bóng, finish bạc sang trọng. Sản phẩm MỚI ✨
- Helicorp Smart Ring Gold: $329 — Mạ PVD vàng, phiên bản giới hạn. Chỉ còn ít hàng ⚡

**Thông số kỹ thuật Smart Ring:**
- Pin: 7 ngày liên tục (sạc không dây, đầy trong 60 phút)
- Chống nước: 100m / 10 ATM (có thể bơi lội thoải mái)
- Chất liệu: Titan Grade 5 + nhựa resin không gây dị ứng
- Cảm biến: Nhịp tim (PPG quang học), HRV, SpO2, nhiệt độ da + môi trường, gia tốc 3D
- Kết nối: Bluetooth Low Energy 5.2
- Tương thích: iOS 14+ và Android 10+
- Trọng lượng: 3,5 – 4,5 gram (siêu nhẹ)
- Bộ nhớ offline: Lưu dữ liệu đến 3 tuần khi không kết nối

**Phụ kiện:**
- Wireless Charging Dock: $39 — Sạc từ tính không dây, thiết kế du lịch compact

**Thời trang / Apparel:**
- Helicorp Logo Tee: $49 (gốc $65, đang giảm) — Cotton hữu cơ 100%, logo thêu tối giản
- Helicorp Snapback Cap: $35 — Mũ 6 panel, logo Helicorp thêu nổi (hiện hết hàng)

=== CHÍNH SÁCH CỬA HÀNG ===
- Vận chuyển: 3-5 ngày làm việc. Miễn phí với đơn trên $100
- Đổi trả: Sản phẩm chưa sử dụng, trong vòng 30 ngày, hoàn tiền 100%
- Bảo hành: 12 tháng cho Smart Ring
- Thanh toán: Thẻ tín dụng, PayPal, chuyển khoản
- Website: helicorp.vn | Hotline: liên hệ qua website

=== VÍ DỤ CÁCH TỪ CHỐI CÂU HỎI NGOÀI CHỦ ĐỀ ===
Nếu khách hỏi: "Thời tiết hôm nay thế nào?" hoặc "Viết code cho tôi" hoặc "Ai là tổng thống Mỹ?"
→ Trả lời: "Xin lỗi bạn nhé, mình chỉ có thể tư vấn về sản phẩm của Merch Shop thôi 😊 Bạn đang tìm kiếm sản phẩm gì? Mình có thể giúp bạn tìm chiếc Smart Ring phù hợp nhất!"`;

// Smart fallback responses (product-focused)
const fallbacks = [
  "Helicorp Smart Ring có pin lên đến 7 ngày và chống nước 100m – hoàn hảo cho mọi hoạt động! 🔋 Bạn đang quan tâm đến phiên bản nào: Obsidian ($299), Silver ($279) hay Gold giới hạn ($329)?",
  "Smart Ring theo dõi nhịp tim, HRV, SpO2, nhiệt độ cơ thể và các giai đoạn giấc ngủ liên tục 24/7. 📡 Bạn muốn cải thiện sức khỏe ở mảng nào: giấc ngủ, tim mạch hay thể lực?",
  "Chúng mình có 3 phiên bản Smart Ring: Obsidian đen matte ($299) bán chạy nhất, Silver bạc ($279) mới ra, và Gold giới hạn ($329). ✨ Bạn ưa phong cách nào?",
  "Miễn phí vận chuyển cho đơn hàng trên $100! Smart Ring Silver $279 đã đủ điều kiện rồi đấy 📦 Bạn có muốn thêm Charging Dock ($39) vào giỏ hàng không?",
  "Bảo hành 12 tháng và đổi trả trong 30 ngày nếu không hài lòng – mua hàng hoàn toàn an tâm! 🛡️ Bạn đang phân vân giữa các phiên bản nào?",
  "Smart Ring dùng Titan Grade 5 – cùng chất liệu trong ngành hàng không và phẫu thuật, chỉ nặng 3.5-4.5g thôi! 💪 Bạn muốn đặt hàng ngay hôm nay không?",
];

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, message: "Invalid message" }, { status: 400 });
    }

    if (GEMINI_API_KEY) {
      // Build conversation history (max last 10 turns to avoid token overflow)
      const contents = [
        ...history.slice(-10).map((h: { role: string; text: string }) => ({
          role: h.role === "bot" ? "model" : "user",
          parts: [{ text: h.text }],
        })),
        { role: "user", parts: [{ text: message }] },
      ];

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              temperature: 0.4,       // Lower = more focused, less random
              topP: 0.9,
              topK: 40,
              maxOutputTokens: 300,
              stopSequences: [],
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ],
          }),
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();

        // Handle blocked content
        if (data?.candidates?.[0]?.finishReason === "SAFETY") {
          return NextResponse.json({
            success: true,
            reply: "Xin lỗi, mình không thể trả lời câu đó. Bạn có muốn hỏi về sản phẩm Smart Ring không? 😊",
          });
        }

        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
          "Xin lỗi, mình chưa hiểu câu hỏi. Bạn hỏi lại được không? 😊";

        return NextResponse.json({ success: true, reply });
      }

      // If Gemini returned non-OK status, log and fallback
      console.warn("[Chat] Gemini API error:", geminiRes.status, await geminiRes.text());
    }

    // Fallback mock (product-focused)
    await new Promise((r) => setTimeout(r, 700));
    const reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return NextResponse.json({ success: true, reply });
  } catch (err) {
    console.error("[Chat] Error:", err);
    return NextResponse.json(
      { success: false, reply: "Có lỗi xảy ra. Bạn thử lại sau nhé! 😊" },
      { status: 500 }
    );
  }
}
