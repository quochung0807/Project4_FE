
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">Elecxo</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for premium electronics and technology products. 
              Quality guaranteed, customer satisfaction is our priority.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/products" className="block text-gray-400 hover:text-white transition-colors text-sm">
                All Products
              </Link>
              <Link to="/products?category=dien-thoai" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Smartphones
              </Link>
              <Link to="/products?category=laptop" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Laptops
              </Link>
              <Link to="/products?category=tai-nghe" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Headphones
              </Link>
              <Link to="/products?category=dong-ho-thong-minh" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Smart Watches
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/support" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Support Center
              </Link>
              <Link to="/shipping" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Shipping Info
              </Link>
              <Link to="/returns" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Returns & Exchanges
              </Link>
              <Link to="/warranty" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Warranty
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Tech Street, Digital District, Ho Chi Minh City
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@elecxo.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Elecxo. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
