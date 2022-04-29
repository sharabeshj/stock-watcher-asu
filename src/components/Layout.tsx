import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export const Layout: FunctionComponent<{ children: ReactNode}> = ({ children }) => {
    return (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography variant="h6" noWrap component={"div"} sx={{ mr: 2, display: { xs: 'none', md: 'flex' }}}>
                            Stock Watcher - ASU
                        </Typography>
                        <Typography variant="h6" noWrap component={"div"} sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
                            Stock Watcher
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth='lg'>
                {children}
            </Container>
        </Box>
    );
}