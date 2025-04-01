import { 
  FaGithub, 
  FaXTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaFacebook, 
  FaWordpress, 
  FaMedium, 
  FaPython, 
  FaYoutube, 
  FaAmazon 
} from 'react-icons/fa6';
import { SiHuggingface, SiKaggle } from 'react-icons/si';
import { GiArtificialIntelligence } from 'react-icons/gi';

const socialLinks = [
  {
    name: 'Twitter',
    url: 'https://x.com/FalahGatea',
    icon: FaXTwitter
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/falah-gatea-060a211a7/',
    icon: FaLinkedin
  },
  {
    name: 'GitHub',
    url: 'https://github.com/falahgs',
    icon: FaGithub
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/falah.g.saleih/',
    icon: FaInstagram
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/falahgs',
    icon: FaFacebook
  },
  {
    name: 'WordPress',
    url: 'https://iraqprogrammer.wordpress.com/',
    icon: FaWordpress
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@falahgs',
    icon: FaMedium
  },
  {
    name: 'PyPI',
    url: 'https://pypi.org/user/falahgs/',
    icon: FaPython
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@FalahgsGate',
    icon: FaYoutube
  },
  {
    name: 'Amazon',
    url: 'https://www.amazon.com/stores/Falah-Gatea-Salieh/author/B0BYHXLP7R',
    icon: FaAmazon
  },
  {
    name: 'Hugging Face',
    url: 'https://huggingface.co/Falah',
    icon: SiHuggingface
  },
  {
    name: 'Kaggle',
    url: 'https://www.kaggle.com/falahgatea',
    icon: SiKaggle
  },
  {
    name: 'Civitai',
    url: 'https://civitai.com/user/falahgs',
    icon: GiArtificialIntelligence
  }
];

export function SocialLinks() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-13 gap-4">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          title={link.name}
        >
          <link.icon className="w-5 h-5" />
          <span className="sr-only">{link.name}</span>
        </a>
      ))}
    </div>
  );
} 