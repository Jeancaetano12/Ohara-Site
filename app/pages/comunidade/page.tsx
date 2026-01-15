export default function Comunidade() {
    return (
        <div className="bg-gradient-to-br from-red-50/50 via-orange-50/50 to-red-50/50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-red-900/20 
                          p-6 mr-20 ml-20 rounded-2xl shadow-lg border border-red-200 dark:border-red-800/50 
                          hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out 
                          transform cursor-pointer relative overflow-hidden animate-pulse">
            <div className="text-center mb-4 relative z-10">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 shadow-lg mx-auto">
                    <span className="text-2xl text-white">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                    Calma lá!
                </h2>
            </div>
            <div className="relative z-10">
                <p className="text-red-600 dark:text-red-300 mb-4 text-center leading-relaxed">
                    Esta parte ainda está em desenvolvimento.
                </p>
            </div>
        </div>
    )
}