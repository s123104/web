/**
 * Modal 模態窗組件
 * 用於顯示通知、確認等信息
 */
export function Modal({ isOpen, title, message, buttonText = '確定', onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md shadow-2xl animate-[modal-appear_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mt-0 text-text-dark text-xl font-semibold mb-4">
          {title}
        </h3>
        <p className="text-text-dark mb-5 whitespace-pre-wrap leading-relaxed">
          {message}
        </p>
        <button
          onClick={onClose}
          className="bg-gradient-to-br from-[#8f7a66] to-[#9d8876] text-white border-none rounded-lg px-6 py-2.5 font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:from-[#9f8b77] hover:to-[#ad9a87] active:translate-y-0"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
