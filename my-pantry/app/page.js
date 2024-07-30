import{ Box, Stack } from "@mui/material"

const stuff=['carrot']
export default function Home() {
  return (
   <Box
      height="120vh"
      width="100vw"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >

      <Stack width="900px" height="1100px" spacing={2}>

        {stuff.map((item) => (
          <Box
      
          
      </Stack>
    </Box>


  )
}
