/**
 * awards-data.ts — All static content for the Award System page.
 * Data extracted directly from the Figma design (MoMorph screen zFYDgyj_pD).
 * DO NOT invent values — only use what is visible in the Figma design.
 */

export interface AwardValue {
  amount: string;
  unit: string;
  note: string;
}

export interface AwardItem {
  /** URL slug used as both anchor ID and in /he-thong-giai#<slug> links */
  slug: string;
  /** Navigation label (left sticky nav) */
  navLabel: string;
  /** Section heading title */
  title: string;
  /** Full description paragraph(s) from Figma */
  description: string;
  /** Number of awards (e.g. "10", "02") */
  quantity: string;
  /** Unit label (e.g. "Đơn vị", "Tập thể", "Cá nhân") */
  quantityUnit: string;
  /**
   * Award value(s). Single award has one entry; Signature 2025 has two
   * (individual + collective).
   */
  values: AwardValue[];
  /**
   * Award image in the section: reuses the homepage card bg image + award name.
   * Points to the existing public/home/ assets.
   */
  nameImage: string;
  nameImageWidth: number;
  nameImageHeight: number;
  /**
   * Layout direction for the image+content row.
   * "image-left" = image on left, content on right.
   * "image-right" = content on left, image on right.
   */
  imagePosition: "image-left" | "image-right";
}

export const AWARDS_NAV_ITEMS: Pick<AwardItem, "slug" | "navLabel">[] = [
  { slug: "top-talent", navLabel: "Top Talent" },
  { slug: "top-project", navLabel: "Top Project" },
  { slug: "top-project-leader", navLabel: "Top Project Leader" },
  { slug: "best-manager", navLabel: "Best Manager" },
  { slug: "signature-2025-creator", navLabel: "Signature 2025 Creator" },
  { slug: "mvp", navLabel: "MVP" },
];

export const AWARDS_LIST: AwardItem[] = [
  {
    slug: "top-talent",
    navLabel: "Top Talent",
    title: "Top Talent",
    description:
      "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.",
    quantity: "10",
    quantityUnit: "Cá nhân",
    values: [
      { amount: "7.000.000 VNĐ", unit: "", note: "cho mỗi giải thưởng" },
    ],
    nameImage: "/home/award-name-top-talent.png",
    nameImageWidth: 221,
    nameImageHeight: 35,
    imagePosition: "image-left",
  },
  {
    slug: "top-project",
    navLabel: "Top Project",
    title: "Top Project",
    description:
      "Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả tối ưu hóa nguồn lực và chi phí tốt, đề xuất các ý tưởng có giá trị cho khách hàng, đem lại lợi nhuận vượt trội và nhận được phản hồi tích cực từ khách hàng. Các thành viên tuân thủ nghiêm ngặt các tiêu chuẩn phát triển nội bộ trong phát triển dự án, tạo nên một hình mẫu về sự xuất sắc và chuyên nghiệp.",
    quantity: "02",
    quantityUnit: "Tập thể",
    values: [
      { amount: "15.000.000 VNĐ", unit: "", note: "cho mỗi giải thưởng" },
    ],
    nameImage: "/home/award-name-top-project.png",
    nameImageWidth: 232,
    nameImageHeight: 35,
    imagePosition: "image-right",
  },
  {
    slug: "top-project-leader",
    navLabel: "Top Project Leader",
    title: "Top Project Leader",
    description:
      'Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy "Aim High – Be Agile" trong mọi bài toán và bối cảnh. Dưới sự dẫn dắt của họ, các thành viên không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Wasshoi, và trưởng thành để trở thành phiên bản tinh hoa – hạnh phúc hơn của chính mình.',
    quantity: "03",
    quantityUnit: "Cá nhân",
    values: [
      { amount: "7.000.000 VNĐ", unit: "", note: "cho mỗi giải thưởng" },
    ],
    nameImage: "/home/award-name-top-project-leader.png",
    nameImageWidth: 232,
    nameImageHeight: 64,
    imagePosition: "image-left",
  },
  {
    slug: "best-manager",
    navLabel: "Best Manager",
    title: "Best Manager",
    description:
      "Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn chinh phục và làm chủ mọi mục tiêu bằng năng lực đa nhiệm, khả năng phối hợp hiệu quả, và tư duy ứng dụng công nghệ linh hoạt trong kỷ nguyên số. Họ truyền cảm hứng để tập thể trở nên tự tin tràn đầy năng lượng, sẵn sàng đón nhận, thậm chí dẫn dắt tạo ra những thay đổi có tính cách mạng.",
    quantity: "01",
    quantityUnit: "Cá nhân",
    values: [
      { amount: "10.000.000 VNĐ", unit: "", note: "" },
    ],
    nameImage: "/home/award-name-best-manager.png",
    nameImageWidth: 232,
    nameImageHeight: 30,
    imagePosition: "image-right",
  },
  {
    slug: "signature-2025-creator",
    navLabel: "Signature 2025 Creator",
    title: "Signature 2025 - Creator",
    description:
      'Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ.  Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần "Creator" đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.',
    quantity: "01",
    quantityUnit: "Cá nhân hoặc tập thể",
    values: [
      {
        amount: "5.000.000 VNĐ",
        unit: "",
        note: "cho giải cá nhân",
      },
      {
        amount: "8.000.000 VNĐ",
        unit: "",
        note: "cho giải tập thể",
      },
    ],
    nameImage: "/home/award-name-signature-creator.png",
    nameImageWidth: 232,
    nameImageHeight: 54,
    imagePosition: "image-left",
  },
  {
    slug: "mvp",
    navLabel: "MVP",
    title: "MVP (Most Valuable Person)",
    description:
      "Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*. Họ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun* suốt năm qua.  Không chỉ nổi bật bởi hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng lan tỏa – thông qua suy nghĩ, hành động và ảnh hưởng tích cực của mình đối với tập thể. MVP là người hội tụ đầy đủ phẩm chất của người Sun* ưu tú, đồng thời mang trên mình trọng trách lớn lao: trở thành hình mẫu đại diện cho con người và tinh thần Sun*, góp phần dẫn dắt tập thể vươn tới những đỉnh cao mới.",
    quantity: "01",
    quantityUnit: "Cá nhân",
    values: [
      { amount: "15.000.000 VNĐ", unit: "", note: "" },
    ],
    nameImage: "/home/award-name-mvp.png",
    nameImageWidth: 116,
    nameImageHeight: 52,
    imagePosition: "image-right",
  },
];
