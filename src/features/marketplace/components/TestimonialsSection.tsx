import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";

const testimonials = [
  {
    id: 1,
    name: "Carlos Mendoza",
    role: "CEO, TechFlow Solutions",
    content:
      "Implementamos el sistema en menos de 10 minutos. No podía creer lo simple que era. El soporte es excepcional.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=webp&w=100",
  },
  {
    id: 2,
    name: "María González",
    role: "Directora de Operaciones, Innovatech",
    content:
      "La transparencia en los precios y la claridad del proceso me dieron total confianza. Vale cada centavo.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=webp&w=100",
  },
  {
    id: 3,
    name: "Roberto Silva",
    role: "CTO, DataCorp",
    content:
      "Finalmente una solución empresarial que no requiere un equipo técnico para configurar. Increíble.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=webp&w=100",
  },
];

export const TestimonialsSection: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2
          className={`text-3xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Empresas que Confían en Nosotros
        </h2>
        <p
          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Miles de empresas ya están usando nuestras soluciones
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-6 rounded-2xl relative overflow-hidden
              ${
                theme === "dark"
                  ? "bg-[#0a0a0a]/60 border border-white/10"
                  : "bg-white border border-gray-200 shadow-lg"
              }
            `}
          >
            {/* Quote Icon */}
            <Quote
              className={`absolute top-4 right-4 opacity-10 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}
              size={48}
            />

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>

            {/* Content */}
            <p
              className={`text-sm mb-6 leading-relaxed relative z-10 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {testimonial.content}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div
                  className={`font-semibold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {testimonial.name}
                </div>
                <div
                  className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  {testimonial.role}
                </div>
              </div>
            </div>

            {/* Verified Badge */}
            <div
              className={`
                absolute bottom-4 right-4 px-2 py-1 rounded-full text-[10px] font-bold
                ${
                  theme === "dark"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-green-50 text-green-700 border border-green-200"
                }
              `}
            >
              ✓ Verificado
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
