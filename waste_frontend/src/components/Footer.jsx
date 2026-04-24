import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaLeaf } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-l from-green-700 to-blue-950 text-slate-200 group">
        <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-white">
                <div className="p-1.5 rounded-lg group-hover:rotate-60 transition-transform duration-[1500ms] ease-in-out">
                    <FaLeaf className="text-green-400 text-3xl" />
                </div>
                <span className="text-2xl font-bold tracking-tight">EcoKLeen <span className="text-green-500">Keralam</span></span>
                </div>
                <p className="text-sm leading-relaxed">
                Leading the way in sustainable waste management across Kerala. 
                Smart collection, responsible recycling, and a cleaner tomorrow.
                </p>
                <div className="flex space-x-4 pt-2">
                <a href="#" className="!text-green-500 hover:!text-blue-500 transition-colors"><FaFacebook size={20} /></a>
                <a href="#" className="!text-green-500 hover:!text-blue-500 transition-colors"><FaTwitter size={20} /></a>
                <a href="#" className="!text-green-500 hover:!text-blue-500 transition-colors"><FaInstagram size={20} /></a>
                <a href="#" className="!text-green-500 hover:!text-blue-500 transition-colors"><FaLinkedin size={20} /></a>
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h3 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Service Links</h3>
                <ul className="space-y-3 text-sm">
                <li><a href="/" className="!text-green-400 hover:!text-blue-500 transition-colors !no-underline">User Dashboard</a></li>
                <li><a href="/profile" className="!text-green-400 hover:!text-blue-500 transition-colors !no-underline">User profile</a></li>
                <li><a href="/complaint" className="!text-green-400 hover:!text-blue-500 transition-colors !no-underline">Raise a Complaint</a></li>
                {/* <li><a href="/payment" className="hover:text-white transition-colors">Pay Collection Fee</a></li> */}
                </ul>
            </div>

            {/* Coverage Section */}
            <div>
                <h3 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Our Coverage</h3>
                <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Kozhikode District</span>
                </li>
                <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Kasargod District</span>
                </li>
                <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Kannur District</span>
                </li>
                <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Wayanad District</span>
                </li>
                <li className="flex items-center space-x-2 font-medium text-green-500 italic">
                    Expanding soon to all 14 districts!
                </li>
                </ul>
            </div>

            {/* Contact Section */}
            <div>
                <h3 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Contact Us</h3>
                <ul className="space-y-4 text-sm">
                <li className="flex items-start space-x-3">
                    <MdLocationOn className="text-green-500 text-xl flex-shrink-0" />
                    <span>Cyberpark Calicut, <br />Kerala, India - 673016</span>
                </li>
                <li className="flex items-center space-x-3">
                    <MdPhone className="text-green-500 text-lg" />
                    <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center space-x-3">
                    <MdEmail className="text-green-500 text-lg" />
                    <span>support@EcoKLeen.com</span>
                </li>
                </ul>
            </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; {currentYear} EcoKLeen Management System. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="!text-white hover:!text-blue-500 transition-colors !no-underline">Privacy Policy</a>
                <a href="#" className="!text-white hover:!text-blue-500 transition-colors !no-underline">Terms of Service</a>
                <a href="#" className="!text-white hover:!text-blue-500 transition-colors !no-underline">Cookie Policy</a>
            </div>
            </div>
        </div>
        </footer>
    );
};
