import Swal from "sweetalert2";

export const successPopup = (msg:string) =>
  Swal.fire({
    icon:"success",
    title:msg,
    position:"center",
    showConfirmButton:false,
    timer:1800,
    timerProgressBar:true
  });

export const errorPopup = (msg:string) =>
  Swal.fire({
    icon:"error",
    title:msg,
    position:"center"
  });

export const loadingPopup = (msg="Processing...") =>
  Swal.fire({
    title:msg,
    allowOutsideClick:false,
    allowEscapeKey:false,
    didOpen:()=>Swal.showLoading()
  });

export const closePopup = () => Swal.close();
