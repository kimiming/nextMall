import React, { Suspense } from 'react';
import Sidebar from '@/app/admin/_components/Sidebar';
import Header from '@/app/admin/_components/Header';
import { Box, Spinner, Flex } from '@chakra-ui/react';
import { Toaster } from '@/app/_components/ui/toaster';
import AdminGuard from '@/app/_components/AdminGuard';
import { ROLES } from '@/app/const/status';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard allowedRoles={[ROLES.SUPERADMIN]}>
            <Flex h="100vh" w="100vw" overflow="hidden">
                <Sidebar />
                <Toaster />
                <Box
                    bgColor="gray.50"
                    _dark={{ bgColor: 'transparent' }}
                    h="full"
                    w="full"
                    minW="800px"
                    overflow="auto"
                    gap={3}
                    display="flex"
                    flexDirection="column"
                >
                    <Header />
                    <Box overflow="auto" h="92%" w="full" p={3}>
                        <Suspense
                            fallback={
                                <Flex
                                    h="full"
                                    w="full"
                                    align="center"
                                    justify="center"
                                >
                                    <Spinner />
                                </Flex>
                            }
                        >
                            {children}
                        </Suspense>
                    </Box>
                </Box>
            </Flex>
        </AdminGuard>
    );
}
