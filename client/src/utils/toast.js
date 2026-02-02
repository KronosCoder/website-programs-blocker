import Swal from 'sweetalert2'

// Dark theme config for SweetAlert2
const darkTheme = {
    background: '#1e293b',
    color: '#f1f5f9',
}

// Toast notification
export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    ...darkTheme,
})

// Show loading dialog
export const showLoading = (title = 'Loading...', html = '') => {
    Swal.fire({
        title,
        html,
        allowOutsideClick: false,
        showConfirmButton: false,
        ...darkTheme,
        didOpen: () => Swal.showLoading()
    })
}

// Close any open dialog
export const closeLoading = () => Swal.close()

// Confirm dialog
export const confirmDialog = async ({
    title,
    text,
    confirmText = 'Yes',
    cancelText = 'Cancel',
    confirmColor = '#ef4444',
    icon = 'warning'
}) => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: confirmColor,
        cancelButtonColor: '#64748b',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        ...darkTheme,
    })
    return result.isConfirmed
}

// Success dialog
export const showSuccess = ({ title, html }) => {
    return Swal.fire({
        title,
        html,
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        ...darkTheme,
    })
}

// Error dialog
export const showError = ({ title, text }) => {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#ef4444',
        ...darkTheme,
    })
}

// Question dialog for export
export const showQuestion = async ({ title, html }) => {
    const result = await Swal.fire({
        title,
        html,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, export!',
        cancelButtonText: 'Cancel',
        ...darkTheme,
    })
    return result.isConfirmed
}
