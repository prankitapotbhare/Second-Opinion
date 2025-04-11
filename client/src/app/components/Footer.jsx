export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Second Opinion</h3>
            <p className="text-green-100 mb-4">
              Connecting patients with medical experts for trusted second opinions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-green-200 cursor-pointer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-green-200 cursor-pointer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-green-200 cursor-pointer">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-white hover:text-green-200 cursor-pointer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-100 hover:text-white cursor-pointer">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white cursor-pointer">
                  Login
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white cursor-pointer">
                  Sign-Up
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white cursor-pointer">
                  Response
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white cursor-pointer">
                  Find Doctors
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-3"></i>
                <span>+91-XXXXXXXXXX</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3"></i>
                <span>support@secondopinion.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <span>123 Health Street, Wellness City, India</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
          <p>&copy; {new Date().getFullYear()} Second Opinion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}