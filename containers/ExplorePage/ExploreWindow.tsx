import {
    AutoSizer,
    List,
    CellMeasurer,
    CellMeasurerCache,
} from 'react-virtualized';
import { GridCoreProps } from 'react-virtualized/dist/es/Grid';
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer';
import { MapPostDataInterface } from '@/types/api/responses/map-post-data.interface';
import { MyLocation } from '@/hooks/useGeolocation';
import SimplePost from '../Post/View/SimplePost';
import { PostStatInterface } from '@/types/api/responses/post-stat.interface';
import React from 'react';
import NoData from '@/components/skeleton/NoData';
import PostDrawer from '../Post/View/PostDrawer';
import { PostDrawerProvider } from '../Post/View/PostDrawerContext';

const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 100,
});

type Props = {
    posts: MapPostDataInterface[];
    userLocation: MyLocation | null;
    onChangeStats?: (stats: PostStatInterface, reactionId: string) => void;
    isLoading?: boolean;
};

export default function ExploreWindow({
    posts,
    userLocation,
    onChangeStats,
    isLoading,
}: Props) {
    function RowRenderer({
        index,
        key,
        parent,
        style,
    }: {
        index: number;
        key: string;
        parent: React.Component<GridCoreProps> & MeasuredCellParent;
        style: React.CSSProperties;
    }) {
        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                {({ registerChild }) => {
                    const item = posts[index];

                    return (
                        <div
                            ref={(element): void => {
                                if (element && registerChild) {
                                    registerChild(element);
                                }
                            }}
                            key={index}
                            style={style}
                        >
                            <SimplePost
                                post={item}
                                userLocation={userLocation}
                                onChangeStats={onChangeStats}
                            />
                        </div>
                    );
                }}
            </CellMeasurer>
        );
    }

    return (
        <PostDrawerProvider>
            {posts.length === 0 && !isLoading && <NoData />}
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        height={height}
                        rowCount={posts.length}
                        rowRenderer={RowRenderer}
                        deferredMeasurementCache={cache}
                        rowHeight={cache.rowHeight}
                        width={width}
                    />
                )}
            </AutoSizer>

            <PostDrawer userLocation={userLocation} />
        </PostDrawerProvider>
    );
}
