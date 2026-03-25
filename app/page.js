import Image from "next/image";

export default function Home() {
  return (
    <>
      <section class="bg-white lg:grid lg:h-screen lg:place-content-center">
        <div class="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div class="max-w-prose text-left">
            <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
              Understand user flow and
              <strong class="text-indigo-600"> increase </strong>
              conversions
            </h1>

            <p class="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident
              accusamus impedit minima harum corporis iusto.
            </p>

            <div class="mt-4 flex gap-4 sm:mt-6">
              <a class="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700" href="#">
                Get Started
              </a>

              <a class="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900" href="#">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white container mx-auto py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <article class="rounded-[10px] border border-gray-200 bg-white px-4 pt-12 pb-4 dark:border-gray-700 dark:bg-gray-900">
          <time datetime="2022-10-10" class="block text-xs text-gray-500 dark:text-gray-400">
            10th Oct 2022
          </time>

          <a href="#">
            <h3 class="mt-0.5 text-lg font-medium text-gray-900 dark:text-white">
              How to center an element using JavaScript and jQuery
            </h3>
          </a>

          <div class="mt-4 flex flex-wrap gap-1">
            <span class="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600 dark:bg-purple-600 dark:text-purple-100">
              Snippet
            </span>

            <span class="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600 dark:bg-purple-600 dark:text-purple-100">
              JavaScript
            </span>
          </div>
        </article>
      </section>
    </>
  );
}
