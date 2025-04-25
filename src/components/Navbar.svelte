<nav class="w-full pb-8">
    <div
        class="flex items-center justify-center py-1 fixed top-0 left-0 right-0 border-b border-thistle bg-black-bean z-20"
    >
        <a
            href="/sessions"
            class="text-plum hover:text-thistle font-semibold text-lg px-4 py-2 rounded-md"
        >
            Sessions
        </a>

        <a
            href="/exercises"
            class="text-plum hover:text-thistle font-semibold text-lg mx-4 px-4 py-2 rounded-md"
        >
            Exercises
        </a>

        <form method="POST" action="/logout" class="flex items-center">
            <button
                type="submit"
                class="text-plum hover:text-burnt-umber font-semibold text-lg px-4 py-2 rounded-md"
            >
                Logout
            </button>
        </form>
    </div>
</nav>
