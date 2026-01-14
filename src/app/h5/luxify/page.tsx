'use client';

import { Box, Flex, Input, SimpleGrid, Text, Image } from '@chakra-ui/react';
import { InputGroup } from '@/app/_components/ui';
import { FiSearch } from 'react-icons/fi';
import BannerCarousel from '../_components/BannerCarousel';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { ContentLoading } from '@/app/_components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function H5Home() {
    // 瀑布流相关状态
    const PAGE_SIZE = 7;
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    // 用于缓存已加载的所有产品（不是阻止请求，而是合并和去重）
    const productCacheRef = useRef<{ [key: number]: any[] }>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const router = useRouter();
    const { data: bannerResponse, isLoading: bannersLoading } =
        api.banner.list.useQuery({ isActive: true, orderBy: 'sort' });
    const banners = bannerResponse?.data ?? [];

    const { data: categoryResponse, isLoading: categoryLoading } =
        api.category.list.useQuery(undefined, {
            refetchOnMount: 'always',
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60, // 1分钟缓存
            gcTime: 1000 * 60 * 5, // 5分钟垃圾回收
        });
    const category = categoryResponse?.data ?? [];

    const { data: productResponse, isLoading: productLoading } =
        api.product.list.useQuery({
            orderBy: 'sales',
            page,
            pageSize: PAGE_SIZE,
        });

    console.log('products Data:', productResponse);
    // 每次 productResponse 或 page 变化时合并数据
    useEffect(() => {
        if (!productResponse?.data) return;
        // 缓存当前页数据
        productCacheRef.current[page] = productResponse.data;
        // 合并所有缓存页的数据（去重）
        const allProducts = Object.values(productCacheRef.current).flat();
        setProducts(allProducts);
        // 判断是否还有更多
        const hasMore = productResponse.data.length === PAGE_SIZE;
        setHasMore(hasMore);
        hasMoreRef.current = hasMore;
        loadingRef.current = false;
        setLoading(false);
    }, [productResponse, page]);

    // 监听滚动到底部 - 使用 onScroll 属性直接在 JSX 中处理
    const handleScroll = (e: any) => {
        if (loadingRef.current || !hasMoreRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            loadingRef.current = true;
            setLoading(true);
            setPage((prev) => prev + 1);
        }
    };

    // 首次加载时自动补充内容，填满容器
    useEffect(() => {
        if (
            page === 1 &&
            hasMoreRef.current &&
            !loadingRef.current &&
            containerRef.current &&
            products.length > 0
        ) {
            const ref = containerRef.current;
            // 如果内容高度小于容器高度，且还有更多数据，则自动加载下一页
            if (ref.scrollHeight <= ref.clientHeight + 10) {
                loadingRef.current = true;
                setLoading(true);
                setPage((prev) => prev + 1);
            }
        }
    }, [products]);

    const isLoading = productLoading;
    if (isLoading && page === 1) {
        return <ContentLoading text="Loading..." />;
    }

    return (
        <Box
            h="calc(100vh - 64px)"
            overflow="scroll"
            style={{
                background:
                    'linear-gradient(to bottom,#2da884, #f4f4f4 50%, #f4f4f4 100%)',
            }}
            ref={containerRef}
            onScroll={handleScroll}
        >
            {/* Search Bar */}
            <Box px={4} pt={4} w="100%">
                <InputGroup
                    w="100%"
                    startOffset="0px"
                    startElement={<FiSearch color="#bbb" size={20} />}
                >
                    <Input
                        size="sm"
                        placeholder="Search"
                        variant="outline"
                        bg="white"
                        borderRadius="full"
                        _focus={{ bg: 'white' }}
                        _placeholder={{ color: 'gray.400' }}
                        onClick={() => router.push('/full/search')}
                        readOnly
                        cursor="pointer"
                    />
                </InputGroup>
            </Box>

            {/* Banner */}
            <Box px={4} mt={4}>
                <BannerCarousel banners={banners} borderRadius="md" />
            </Box>

            <Box px={4} mt={4}>
                <SimpleGrid
                    columns={4}
                    rowGap={4}
                    bg="white"
                    borderRadius="xl"
                    py={4}
                    shadow="md"
                >
                    {category?.map((entry: any) => (
                        <Link
                            href={`/h5/category?id=${entry.id}`}
                            key={entry.name}
                        >
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                            >
                                <Image
                                    src={entry.icon}
                                    w={14}
                                    height={14}
                                    alt={entry.description}
                                />
                                <Text fontSize="xs" color="gray.700" truncate>
                                    {entry.name}
                                </Text>
                            </Flex>
                        </Link>
                    ))}
                </SimpleGrid>
            </Box>
            {/* 为您推荐横幅 */}
            <Flex align="center" justify="center" mt={4} mb={4} w="100%">
                <Text as="span" color="gre.400" fontSize="lg" mx={1}>
                    ❤
                </Text>
                <Text fontWeight="medium" color="gray.700" fontSize="md">
                    Recommended for you
                </Text>
                <Text as="span" color="red.400" fontSize="lg" mx={1}>
                    ❤
                </Text>
            </Flex>

            {/* 商品推荐区块 */}
            <Box px={4} mt={2} pb={4}>
                <SimpleGrid columns={2} gap={2}>
                    {products?.map((item: any) => (
                        <Link
                            href={`/full/product?id=${item.id}`}
                            key={item.id}
                        >
                            <Box
                                bg="white"
                                borderRadius="sm"
                                boxShadow="2xs"
                                p={2}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                            >
                                <Box
                                    w="100%"
                                    h="140px"
                                    mb={2}
                                    borderRadius="md"
                                    overflow="hidden"
                                    bg="#f7f7f7"
                                    position="relative"
                                >
                                    <Image
                                        src={item.images?.[0]}
                                        alt={item.title}
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        position="absolute"
                                        top={0}
                                        left={0}
                                    />
                                </Box>
                                <Text
                                    fontSize="md"
                                    py={2}
                                    color="gray.800"
                                    fontWeight="medium"
                                    truncate
                                    w="100%"
                                    textAlign="left"
                                    title={item.title}
                                >
                                    {item.title}
                                </Text>
                                <Flex
                                    w="100%"
                                    align="center"
                                    justify="space-between"
                                >
                                    <Text
                                        fontSize="sm"
                                        color="red.500"
                                        fontWeight="bold"
                                        textAlign="left"
                                    >
                                        <Text
                                            as="span"
                                            fontSize="md"
                                            color="red.400"
                                            verticalAlign="baseline"
                                        >
                                            $
                                        </Text>
                                        {item.specs[0]?.price.toFixed(2)}
                                    </Text>
                                    <Text
                                        fontSize="2xs"
                                        fontWeight="normal"
                                        color="gray.500"
                                    >
                                        {/* 已售{item.sales}件 */}
                                    </Text>
                                </Flex>
                            </Box>
                        </Link>
                    ))}
                </SimpleGrid>
                {loading && (
                    <Box textAlign="center" py={2}>
                        loading...
                    </Box>
                )}
                {!hasMore && (
                    <Box textAlign="center" py={2} color="gray.400">
                        no more
                    </Box>
                )}
            </Box>
        </Box>
    );
}
