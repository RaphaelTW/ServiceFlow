import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

type ConfirmTone = 'blue' | 'green' | 'red';

export async function confirmAction(title: string, text: string, confirmButtonText: string, tone: ConfirmTone = 'green') {
  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'sf-alert',
      confirmButton: `sf-alert-confirm sf-alert-confirm--${tone}`,
      cancelButton: 'sf-alert-cancel'
    }
  });

  return result.isConfirmed;
}

export function toast(title: string, icon: 'success' | 'error' | 'info' = 'success') {
  void Swal.fire({
    title,
    icon,
    timer: 1800,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    customClass: {
      popup: 'sf-toast'
    }
  });
}

export function showError(message: string) {
  void Swal.fire({
    title: 'Não foi possível concluir',
    text: message,
    icon: 'error',
    confirmButtonText: 'Entendi',
    buttonsStyling: false,
    customClass: {
      popup: 'sf-alert',
      confirmButton: 'sf-alert-confirm'
    }
  });
}
