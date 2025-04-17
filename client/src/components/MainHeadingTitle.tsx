type Props = {
  title: string;
  subtitle?: string;
  className?: string;
};

const MainHeadingTitle = ({ title, subtitle, className }: Props) => {
  return (
    <div
      className={`${className} flex flex-col bg-title-section-menu rounded-xl p-3 gap-2 text-center`}
    >
      <span className="text-white font-bold text-3xl">{title}</span>
      {subtitle && <p className="text-gray-100 text-xl">{subtitle}</p>}
    </div>
  );
};

export default MainHeadingTitle;
