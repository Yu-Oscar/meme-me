import { TagWithCount } from "../queries/get-tags";
import TagItem from "./TagItem";

interface TagListProps {
    tags: TagWithCount[];
}

export default function TagList({ tags }: TagListProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {tags.map((tag) => (
                <TagItem key={tag.tag} tag={tag} />
            ))}
        </div>
    );
}