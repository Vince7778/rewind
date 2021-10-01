import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { Help, MoreVert, PauseCircle, PhotoCamera, PlayCircle, VolumeUp } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { BaseAudioSettingsPanel } from "./BaseAudioSettingsPanel";
import { BaseGameTimeSlider } from "./BaseGameTimeSlider";
import { BaseCurrentTime, useAnalysisApp } from "@rewind/feature-replay-viewer";
import { useGameClockControls, useGameClockTime } from "../hooks/gameClock";
import { formatGameTime } from "@rewind/osu/math";
import { useAudioSettings, useAudioSettingsService } from "../hooks/audio";

const centerUp = {
  anchorOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
};

function MoreMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls="long-menu"
        // aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PhotoCamera />
          </ListItemIcon>
          <ListItemText>Take Screenshot</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

function AudioButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { volume, muted } = useAudioSettings();
  const service = useAudioSettingsService();

  return (
    <>
      <IconButton onClick={handleClick}>
        <VolumeUp />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box width={256}>
          <BaseAudioSettingsPanel
            {...volume}
            onMasterChange={(x) => service.setMasterVolume(x)}
            onMusicChange={(x) => service.setMusicVolume(x)}
            onEffectsChange={(x) => service.setEffectsVolume(x)}
          />
        </Box>
      </Popover>
    </>
  );
}

// Connected
function PlayButton() {
  const { isPlaying, toggleClock } = useGameClockControls();
  const Icon = !isPlaying ? PlayCircle : PauseCircle;

  return (
    <IconButton onClick={toggleClock}>
      <Icon fontSize={"large"} />
    </IconButton>
  );
}

function CurrentTime() {
  const currentTime = useGameClockTime(60);
  return (
    // We MUST fix the width because the font is not monospace e.g. "111" is thinner than "000"
    // Also if the duration is more than an hour there will also be a slight shift
    <Box sx={{ width: "6em" }}>
      <BaseCurrentTime currentTime={currentTime} />
    </Box>
  );
}

function GameTimeSlider() {
  // TODO: Depending on if replay is loaded and settings
  const backgroundEnable = true;
  const currentTime = useGameClockTime(30);
  const { seekTo, duration } = useGameClockControls();

  return (
    <BaseGameTimeSlider
      backgroundEnable={backgroundEnable}
      duration={duration}
      currentTime={currentTime}
      onChange={seekTo}
    />
  );
}

function Duration() {
  const { duration } = useGameClockControls();
  const f = formatGameTime(duration);

  return <Typography>{f}</Typography>;
}

export function PlayBar() {
  return (
    <Stack height={64} gap={2} p={2} direction={"row"} alignItems={"center"}>
      <PlayButton />
      <CurrentTime />
      <GameTimeSlider />
      <Duration />
      <AudioButton />
      <MoreMenu />
    </Stack>
  );
}
