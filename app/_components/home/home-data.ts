/**
 * home-data.ts — All mock/static content for the Homepage SAA.
 * Data extracted directly from the Figma design. Do NOT invent values here.
 */

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

// Active state is derived from the current pathname in the header/footer
// components (route-aware), not hardcoded here.
export const NAV_LINKS: NavLink[] = [
  { label: "About SAA 2025", href: "/" },
  { label: "Awards Information", href: "/he-thong-giai" },
  { label: "Sun* Kudos", href: "/kudos" },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  { label: "About SAA 2025", href: "/" },
  { label: "Awards Information", href: "/he-thong-giai" },
  { label: "Sun* Kudos", href: "/kudos" },
  { label: "Tiêu chuẩn chung", href: "/criteria" },
];

export interface AwardCard {
  slug: string;
  title: string;
  description: string;
  nameImage: string;
  nameImageWidth: number;
  nameImageHeight: number;
}

export const AWARD_CARDS: AwardCard[] = [
  {
    slug: "top-talent",
    title: "Top Talent",
    description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
    nameImage: "/home/award-name-top-talent.png",
    nameImageWidth: 221,
    nameImageHeight: 35,
  },
  {
    slug: "top-project",
    title: "Top Project",
    description:
      "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật",
    nameImage: "/home/award-name-top-project.png",
    nameImageWidth: 232,
    nameImageHeight: 35,
  },
  {
    slug: "top-project-leader",
    title: "Top Project Leader",
    description:
      "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá",
    nameImage: "/home/award-name-top-project-leader.png",
    nameImageWidth: 232,
    nameImageHeight: 64,
  },
  {
    slug: "best-manager",
    title: "Best Manager",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameImage: "/home/award-name-best-manager.png",
    nameImageWidth: 232,
    nameImageHeight: 30,
  },
  {
    slug: "signature-2025-creator",
    title: "Signature 2025 - Creator",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameImage: "/home/award-name-signature-creator.png",
    nameImageWidth: 232,
    nameImageHeight: 54,
  },
  {
    slug: "mvp",
    title: "MVP (Most Valuable Person)",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameImage: "/home/award-name-mvp.png",
    nameImageWidth: 116,
    nameImageHeight: 52,
  },
];

export const ROOT_FURTHER_PARAGRAPHS = [
  `Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là "problem-solver" - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.\nLấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, "Root Further" đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.\nVượt ra khỏi nét nghĩa bề mặt, "Root Further" chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng "địa chất" ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua từng lớp "trầm tích" để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang "hấp thụ" dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ "bén rễ" vào kỷ nguyên AI - một tầng "địa chất" hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.`,
  `Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương mới trên hành trình phát triển tổ chức, "Root Further" còn như một lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn.\nKhông ai biết trước ẩn sâu trong "lòng đất" của ngành công nghệ và thị trường hiện đại còn biết bao tầng "địa chất" bí ẩn. Chỉ biết rằng khi "Root Further" đã trở thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy háo hức trước bất cứ vùng vô định nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.`,
];

export const ENGLISH_PROVERB =
  '"A tree with deep roots fears no storm"\n (Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)';

// Date/time are derived from NEXT_PUBLIC_EVENT_DATETIME (see hero-section),
// so only the non-env fields live here.
export const EVENT_INFO = {
  venue: "Âu Cơ Art Center",
  livestream: "Tường thuật trực tiếp qua sóng Livestream",
};

export const KUDOS_CONTENT = {
  label: "Phong trào ghi nhận",
  title: "Sun* Kudos",
  description:
    "ĐIỂM MỚI CỦA SAA 2025\nHoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.",
  ctaLabel: "Chi tiết",
  ctaHref: "/kudos",
};
