function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="px-6 md:px-16 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            🍔 Foodie
          </h3>
          <p>
            Nền tảng đặt đồ ăn nhanh chóng – tiện lợi – giá tốt.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">
            Liên hệ
          </h4>
          <p>Email: adasdad.com</p>
          <p>Hotline: 0123 456 789</p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">
            Địa chỉ
          </h4>
          <p>Đông Hàm Dương</p>
          <p>Hp, Việt Nam</p>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-700 text-sm">
        Viper food
      </div>
    </footer>
  );
}

export default Footer;