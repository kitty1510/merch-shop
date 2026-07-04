"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import styles from "./Newsletter.module.css";
import { Loader2, Mail, User } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setIsSuccess(true);
        reset();
        toast(json.message ?? "You're on the list! 🎉", "success");
        setTimeout(() => setIsSuccess(false), 6000);
      } else if (res.status === 409) {
        toast("This email is already subscribed.", "warning");
      } else {
        toast(json.message ?? "Something went wrong. Please try again.", "error");
      }
    } catch {
      toast("Network error. Please check your connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={styles.card}
        >
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <Mail size={28} />
            </div>
            <h2 className={styles.title}>Join the Waitlist</h2>
            <p className={styles.description}>
              Be the first to know when the Helicorp Smart Ring launches and get exclusive early-bird pricing. No spam — ever.
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              className={styles.successState}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.successIcon}>🎉</div>
              <h3>You&apos;re on the list!</h3>
              <p>We&apos;ll reach out with exclusive launch news and early-bird pricing.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  <User size={15} /> Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  {...register("name")}
                />
                {errors.name && (
                  <motion.span
                    className={styles.error}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.name.message}
                  </motion.span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  <Mail size={15} /> Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <motion.span
                    className={styles.error}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email.message}
                  </motion.span>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={isSubmitting}
                id="subscribe-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe Now →"
                )}
              </button>

              <p className={styles.privacy}>
                🔒 We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
