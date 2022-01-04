if (NOTE !== "undefined") {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: NOTE,
        showConfirmButton: false,
        timer: 2000
    })
}
if (ERROR !== "undefined") {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: ERROR,
        showConfirmButton: false,
        timer: 3000
    })
}