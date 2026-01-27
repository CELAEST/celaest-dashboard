export const getCardGradient = (type: string, isDark: boolean) => {
  switch (type) {
    case "visa":
      return isDark
        ? "bg-linear-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20"
        : "bg-linear-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20";
    case "mastercard":
      return isDark
        ? "bg-linear-to-br from-orange-500/10 to-red-500/10 border-orange-500/20"
        : "bg-linear-to-br from-orange-500/5 to-red-500/5 border-orange-500/20";
    case "amex":
      return isDark
        ? "bg-linear-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20"
        : "bg-linear-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20";
    default:
      return isDark
        ? "bg-linear-to-br from-gray-500/10 to-gray-600/10 border-gray-500/20"
        : "bg-linear-to-br from-gray-500/5 to-gray-600/5 border-gray-500/20";
  }
};

export const getCardIconBg = (type: string, isDark: boolean) => {
  switch (type) {
    case "visa":
      return isDark ? "bg-blue-500/20" : "bg-blue-500/10";
    case "mastercard":
      return isDark ? "bg-orange-500/20" : "bg-orange-500/10";
    case "amex":
      return isDark ? "bg-purple-500/20" : "bg-purple-500/10";
    default:
      return isDark ? "bg-gray-500/20" : "bg-gray-500/10";
  }
};

export const getCardIconColor = (type: string) => {
  switch (type) {
    case "visa":
      return "text-blue-500";
    case "mastercard":
      return "text-orange-500";
    case "amex":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
};
