import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = localStorage.getItem('token');
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
    enabled: !!token,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
  };
}
