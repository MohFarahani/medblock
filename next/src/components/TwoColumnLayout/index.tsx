import { Box, Grid } from "@mui/material";

interface TwoColumnLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftWidth?: number;  // Grid columns (1-12)
  rightWidth?: number; // Grid columns (1-12)
}

const TwoColumnLayout = ({ 
  leftContent, 
  rightContent, 
  leftWidth = 3, 
  rightWidth = 9 
}: TwoColumnLayoutProps) => {
  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 64px)' }}>
      {/* Left column */}
      <Grid item xs={leftWidth}>
        <Box sx={{ 
          height: '100%', 
          overflowY: 'auto',
          borderRight: '1px solid #e0e0e0'
        }}>
          {leftContent}
        </Box>
      </Grid>

      {/* Right column */}
      <Grid item xs={rightWidth}>
        <Box sx={{ height: '100%', p: 2 }}>
          {rightContent}
        </Box>
      </Grid>
    </Grid>
  );
};

export default TwoColumnLayout; 