import AISearch from "./ai-search/page";
import SimpleSearch from "./simple-search/page";

export default function Home() {
  return (
      <div className="flex justify-center items-center mx-auto w-full max-w-5xl py-4">
        <div className="tabs tabs-lift w-full">

          {/* Native Search */}
          <input
            type="radio"
            name="my_tabs_4"
            className="tab"
            aria-label="🌐 Native Search"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6 min-h-[94vh]">
            <SimpleSearch />
          </div>

          {/* AI Search */}
          <input
            type="radio"
            name="my_tabs_4"
            className="tab"
            aria-label="🤖 AI Search"
            defaultChecked
          />
          <div className="tab-content bg-base-100 border-base-300 p-6 min-h-[94vh]">
            <AISearch />
          </div>

        </div>
      </div>
  );
}