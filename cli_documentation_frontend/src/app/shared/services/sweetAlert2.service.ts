import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlert2Service {
  /**
   * Show an error message.
   * @param text - The text of the message.
   * @param title - The title of the message.
   * @param icon - The icon of the message.
   */
  public show_error_message(text: string = 'Something went wrong!', title: string = 'Oops...', icon: SweetAlertIcon = 'error'): Promise<any> {
    return Swal.fire({
      icon,
      title,
      text
    });
  }

  /**
   * Show a success message.
   * @param title - The title of the message.
   * @param icon - The icon of the message.
   * @param position - The position of the message.
   * @param timer - The duration the message is shown.
   */
  public show_succesful_message(title: string = "Your work has been saved", icon: SweetAlertIcon = 'success', position: SweetAlertPosition = 'center', timer: number = 1500): Promise<any> {
    return Swal.fire({
      position,
      icon,
      title,
      showConfirmButton: false,
      timer
    });
  }

  /**
   * Show a confirmation dialog.
   * @param title - The title of the dialog.
   * @param text - The text of the dialog.
   * @param confirmButtonText - The text of the confirm button.
   * @param icon - The icon of the dialog.
   */
  public confirm_action(title: string = "Are you sure?", text: string = "", confirmButtonText: string = "Yes, I confirm", icon: SweetAlertIcon = 'info'): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText
    })
  }
}
