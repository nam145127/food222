import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col overflow-hidden transition-colors">

      <Header />

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden">
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
          alt="about"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative text-center px-6 max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            VIPER FOOD 🍔
          </h1>

          <p className="text-lg md:text-xl opacity-90 leading-relaxed">
            Chúng tôi không chỉ bán món ăn.  
            Chúng tôi mang đến trải nghiệm ẩm thực trọn vẹn,  
            nơi mỗi bữa ăn là một khoảnh khắc đáng nhớ.
          </p>
        </motion.div>
      </section>

      {/* ================= STORY ================= */}
      <section className="px-6 md:px-20 py-20 bg-white dark:bg-gray-800 transition-colors">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <motion.img
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1"
            alt="restaurant"
            className="rounded-2xl shadow-xl w-full h-[420px] object-cover"
          />

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 dark:text-white">
              Câu chuyện của chúng tôi
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              VIPER FOOD được xây dựng từ niềm đam mê ẩm thực và mong muốn
              mang đến những món ăn chất lượng cao với mức giá hợp lý.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Từ một căn bếp nhỏ, chúng tôi đã phát triển thành hệ thống
              phục vụ hàng ngàn khách hàng mỗi tháng, luôn giữ vững tiêu chí:
              ngon – sạch – nhanh – tận tâm.
            </p>

            <Button
              size="lg"
              onClick={() => (window.location.href = "/menu")}
            >
              Khám phá thực đơn
            </Button>
          </motion.div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="px-6 md:px-20 py-20 bg-orange-600 text-white">
        <div className="grid md:grid-cols-3 gap-10 text-center">

          {[
            { number: "10.000+", label: "Khách hàng hài lòng" },
            { number: "50+", label: "Món ăn đa dạng" },
            { number: "5★", label: "Đánh giá trung bình" },
          ].map((item, index) => (

            <motion.div
              key={index}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-extrabold mb-3">
                {item.number}
              </h3>

              <p className="text-lg opacity-90">
                {item.label}
              </p>
            </motion.div>

          ))}

        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="px-6 md:px-20 py-20 bg-gray-50 dark:bg-gray-900 transition-colors">

        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          Đội ngũ đầu bếp
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            "https://images.unsplash.com/photo-1607631568010-a87245c0daf8",
            "data:image/jpeg;base64,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",
            "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
          ].map((img, index) => (

            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-xl transition overflow-hidden text-center"
            >
              <img
                src={img}
                alt="chef"
                className="w-full h-72 object-cover"
              />

              <div className="p-6">
                <h3 className="font-semibold text-lg dark:text-white">
                  Đầu bếp chuyên nghiệp
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  Nhiều năm kinh nghiệm trong lĩnh vực ẩm thực.
                </p>
              </div>

            </motion.div>

          ))}

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 md:px-20 py-20 bg-black text-white text-center">

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng thưởng thức chưa? 😋
          </h2>

          <Button
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => (window.location.href = "/menu")}
          >
            Đặt món ngay
          </Button>

        </motion.div>

      </section>

      <Footer />

    </div>
  );
}

export default AboutPage;