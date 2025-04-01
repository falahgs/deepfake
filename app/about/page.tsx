import { ShieldCheckIcon, BeakerIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About DeepFake Detective</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-600 mb-8">
            DeepFake Detective is an advanced platform dedicated to combating the growing threat of AI-generated fake videos through cutting-edge detection technology.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6">Our Mission</h2>
          <p>
            In an era where AI-generated synthetic media is becoming increasingly sophisticated, our mission is to provide powerful, accessible tools that help individuals and organizations verify the authenticity of video content. We believe in fostering digital literacy and creating a more trustworthy information ecosystem.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6">Our Technology</h2>
          
          <div className="grid md:grid-cols-3 gap-8 my-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LightBulbIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Leveraging Google&apos;s Gemini multimodal AI to analyze both visual and audio elements of videos with exceptional accuracy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BeakerIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Dimensional Analysis</h3>
              <p className="text-gray-600">
                Examining synchronization, temporal consistency, facial anomalies, and audio artifacts for comprehensive detection.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy-Focused</h3>
              <p className="text-gray-600">
                Ensuring your uploaded content is processed securely and not stored permanently on our servers.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-12 mb-6">Why This Matters</h2>
          <p>
            Deepfakes pose significant challenges to trust in digital media, with potential impacts on:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Information integrity in journalism and public discourse</li>
            <li>Personal reputation and privacy</li>
            <li>Security in business and government communications</li>
            <li>Evidence validity in legal proceedings</li>
          </ul>
          
          <p className="mt-6">
            By providing advanced detection tools, we aim to mitigate these risks and empower users to make informed judgments about the content they encounter online.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6">Our Team</h2>
          <p>
            DeepFake Detective was created by a team of AI researchers, digital forensics experts, and software engineers committed to addressing the challenges of synthetic media. The project is led by Falah Gatea, an experienced AI developer with a focus on ethical applications of artificial intelligence.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-6">Contact Us</h2>
          <p>
            Have questions about our platform or interested in learning more about deepfake detection technology? Feel free to reach out to us at <a href="mailto:contact@deepfakedetective.io" className="text-blue-600 hover:text-blue-800">contact@deepfakedetective.io</a>.
          </p>
        </div>
      </section>
    </div>
  );
} 