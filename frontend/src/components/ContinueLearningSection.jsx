import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getContinueLearning } from "../api/progress";

// Self-fetching — used on both the Landing page and My Courses. Renders
// nothing for anonymous users or once loaded if there's nothing unfinished.
const ContinueLearningSection = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    getContinueLearning()
      .then((data) => {
        if (!cancelled) setItems(data.continueLearning || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated || !loaded || items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Continue Learning</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.course._id}
            to={`/content/${item.resumeContent._id}`}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="w-full aspect-video bg-gray-100 overflow-hidden">
              {item.course.thumbnail && (
                <img
                  src={item.course.thumbnail}
                  alt={item.course.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <p className="font-semibold text-gray-900 truncate mb-1">{item.course.title}</p>
              <p className="text-xs text-gray-500 mb-2 truncate">Resume: {item.resumeContent.title}</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: `${item.completionPercent}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.completionPercent}% complete</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContinueLearningSection;
