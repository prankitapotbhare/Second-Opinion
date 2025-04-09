import { doctors } from "../data/staticData";
import DoctorCard from "./DoctorCard";

export default function DoctorsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Recommended Doctors
        </h2>
        <p className="text-gray-600 mb-8">
          Top specialists available for your medical second opinion
        </p>
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}