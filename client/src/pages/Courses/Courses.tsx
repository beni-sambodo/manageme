import { Breadcrumb, Empty, Spin, message, Pagination } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import CourseCard from "./CourseCard";
import AddButton from "../../components/AddButton";
import { useApiGet } from "../../services/queryConfig";
import courseService from "../../services/course.service";
import { ICourse } from "../../Types/Types";
import { useTranslation } from "react-i18next";
import CourseFilter from "./CourseFilter";
import { useEffect, useState } from "react";

const DEFAULT_PAGE_SIZE = 10; // Default page size

export default function Courses() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters, pagination, and page size
  const [filters, setFilters] = useState<any>({
    category: searchParams.get("category") || null,
    duration: Number(searchParams.get("duration") || null),
    type: searchParams.get("type") || null,
    name: searchParams.get("name") || null,
    priceMin: Number(searchParams.get("priceMin") || null),
    priceMax: Number(searchParams.get("priceMax") || null),
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const { isLoading, data, error, refetch } = useApiGet(
    ["getCourses", filters, currentPage, pageSize],
    () => courseService.getCourses(filters, currentPage, pageSize)
  );

  // Update URL query parameters when filters or page changes
  useEffect(() => {
    const params: any = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params[key] = filters[key];
    });
    setSearchParams({ ...params, page: currentPage.toString(), size: pageSize.toString() });
  }, [filters, currentPage, pageSize, setSearchParams]);

  // Handle filter changes from CourseFilter component
  const handleFilterChange = (key: string, value: any) => {
    if (key === "clear") {
      setFilters({});
    } else {
      setFilters((prev: any) => ({ ...prev, [key]: value }));
    }
  };

  // Handle page size change
  const handleLimitChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page when the size changes
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    message.error(t("courses.loadError"));
    return <p>{t("courses.loadError")}</p>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            {
              title: <Link to={"/dashboard"}>{t("groups.breadcrumb.home")}</Link>,
            },
            {
              title: t("courses.courses"),
            },
          ]}
        />
        <AddButton text={t("courses.button")} link={"/dashboard/courses/add"} />
      </div>

      {/* Pass filters and handleFilterChange to CourseFilter */}
      <CourseFilter handleFilterChange={handleFilterChange} filters={filters} />

      {isLoading ? (
        <div className="w-full flex justify-center items-center min-h-[100vh]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex mt-4 gap-5 justify-between items-start">
          <div className="flex w-full gap-5 min-h-[80vh]">
            {data?.datas?.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 2xl:grid-cols-4 gap-5 w-full">
                {data?.datas?.map((i: ICourse) => (
                  <CourseCard key={i._id} data={i} refetch={refetch} />
                ))}
              </div>
            ) : (
              <div className="w-full py-10">
                <Empty description={t("noData")} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination Control */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          onShowSizeChange={handleLimitChange}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          pageSize={pageSize}
          total={data?.pagination?.count || 0}
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>
    </div>
  );
}
