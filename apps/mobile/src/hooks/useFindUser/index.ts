import UserService from "@/services/UserService";
import { useMutation } from "@tanstack/react-query";

export default function useFindUser() {
  return useMutation({
    mutationFn: (code: string) => UserService.findById(code),
    mutationKey: ["find-user"],
  });
}
