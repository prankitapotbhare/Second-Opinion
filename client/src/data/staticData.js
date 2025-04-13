export const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Oncology",
  "Pediatrics",
  "Dermatology",
  "Gynecology",
];

export const faqs = [
  {
    question: "What is a second opinion and why is it important?",
    answer:
      "A second opinion is a review of your diagnosis, treatment plan, or medical condition by another doctor. It helps confirm diagnoses, explore alternative treatments, and gives you peace of mind about your healthcare decisions.",
  },
  {
    question: "Is my data safe with this platform?",
    answer:
      "Yes, we take data privacy seriously. All your medical information is encrypted and stored securely according to HIPAA standards. We never share your information with third parties without your explicit consent.",
  },
  {
    question: "How do I upload medical reports?",
    answer:
      "After creating an account, you can easily upload your medical reports through your dashboard. We accept PDF, JPEG, and PNG formats. Our system will securely store these documents for doctor review.",
  },
  {
    question: "How long does it take to receive a doctor's response?",
    answer:
      "Most second opinions are delivered within 48-72 hours after all required documents are submitted. For urgent cases, we offer expedited services that can provide responses within 24 hours.",
  },
  {
    question: "Can I choose a specific doctor or department?",
    answer:
      "Yes, you can select a specific department or doctor based on your medical needs. Our platform allows you to browse doctor profiles and select the specialist who best matches your requirements.",
  },
];

export const doctors = [
  {
    id: "1", // Make sure ID is a string to match URL param
    name: "Dr. Emily Johnson",
    department: "Cardiology",
    degree: "M.D., FACC",
    experience: "8 years",
    hospital: "City Heart Institute",
    imageUrl: "https://public.readdy.ai/ai/img_res/44c49570964d9978bef233f93cc1e776.jpg"
  },
  {
    id: "2", // Updated to string
    name: "Dr. Michael Chen",
    department: "Neurology",
    degree: "MD, PhD",
    experience: "12 years",
    hospital: "Neuroscience Medical Center", // Added hospital
    imageUrl: "https://public.readdy.ai/ai/img_res/asian_male_doctor_professional_headshot.jpg", // Added imageUrl
    imagePrompt:
      "Professional portrait of an Asian male doctor wearing a white coat with stethoscope, warm friendly smile, against a light blue medical office background, high quality professional headshot, clean lighting, medical professional appearance, confident posture, approachable demeanor, studio quality photograph with soft shadows",
  },
  {
    id: "3", // Updated to string
    name: "Dr. Emily Rodriguez",
    department: "Orthopedics",
    degree: "MD, FAAOS",
    experience: "10 years",
    hospital: "Joint & Spine Specialists", // Added hospital
    imageUrl: "https://public.readdy.ai/ai/img_res/female_doctor_orthopedics_headshot.jpg", // Added imageUrl
    imagePrompt:
      "Professional portrait of a female doctor wearing a white coat with stethoscope, warm friendly smile, against a light blue medical office background, high quality professional headshot, clean lighting, medical professional appearance, confident posture, approachable demeanor, studio quality photograph with soft shadows",
  },
  {
    id: "4", // Updated to string
    name: "Dr. James Wilson",
    department: "Oncology",
    degree: "MD, FASCO",
    experience: "18 years",
    hospital: "Cancer Treatment Center", // Added hospital
    imageUrl: "https://public.readdy.ai/ai/img_res/male_doctor_oncology_headshot.jpg", // Added imageUrl
    imagePrompt:
      "Professional portrait of a male doctor wearing a white coat with stethoscope, warm friendly smile, against a light blue medical office background, high quality professional headshot, clean lighting, medical professional appearance, confident posture, approachable demeanor, studio quality photograph with soft shadows",
  },
];