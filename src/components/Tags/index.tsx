import "./styles.scss";
type Props = {
  data: Array<any>;
};

const Tags = ({ data }: Props) => {
  return (
    <div className="tags">
      {data.length > 0 &&
        data?.map((g, i) => {
          if (!g) return;
          return (
            <div key={g + "-" + i} className="tag">
              {g.toLowerCase()}
            </div>
          );
        })}
    </div>
  );
};

export default Tags;
