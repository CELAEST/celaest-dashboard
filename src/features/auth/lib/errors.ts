export function getAuthErrorMessage(error: {
  message: string;
  status?: number;
}): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials":
      "Credenciales inválidas. Verifica tu email y contraseña.",
    "Email not confirmed":
      "Por favor verifica tu email antes de iniciar sesión.",
    "User already registered": "Este email ya está registrado.",
    "Password should be at least 6 characters":
      "La contraseña debe tener al menos 6 caracteres.",
    "Unable to validate email address: invalid format":
      "El formato del email no es válido.",
  };

  return (
    errorMap[error.message] || error.message || "Ocurrió un error inesperado."
  );
}
