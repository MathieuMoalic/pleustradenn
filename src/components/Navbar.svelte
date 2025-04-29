<nav class="w-full pb-8">
    <div
        class="fixed top-0 left-0 right-0 border-b border-thistle bg-black-bean z-20"
    >
        <div
            class="flex items-center justify-between px-6 py-2 max-w-7xl mx-auto w-full"
        >
            <div class="flex items-center gap-6">
                <a
                    href="/sessions"
                    class="text-plum hover:text-thistle font-semibold text-lg px-2 py-1 rounded-md"
                >
                    Sessions
                </a>

                <a
                    href="/exercises"
                    class="text-plum hover:text-thistle font-semibold text-lg px-2 py-1 rounded-md"
                >
                    Exercises
                </a>
            </div>

            <form method="POST" action="/logout" class="flex items-center">
                <button
                    type="submit"
                    class="text-plum hover:text-burnt-umber font-semibold text-lg px-2 py-1 rounded-md"
                >
                    Logout
                </button>
            </form>
        </div>
    </div>
</nav>
