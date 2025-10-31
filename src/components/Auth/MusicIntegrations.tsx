import React from "react";
import { Button } from "../Button";
import { Text } from "../Text";
import { useAuth } from "../../hooks/useAuth";
import type { MusicProvider } from "../../types/auth";
import styles from "./MusicIntegrations.module.css";

interface MusicIntegrationsProps {
  className?: string;
}

const musicProviderConfig = {
  spotify: {
    name: "Spotify",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    color: "#1DB954",
  },
  "apple-music": {
    name: "Apple Music",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF3B30">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    color: "#FF3B30",
  },
  "youtube-music": {
    name: "YouTube Music",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
      </svg>
    ),
    color: "#FF0000",
  },
  soundcloud: {
    name: "SoundCloud",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF8C00">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.054.05.099.101.099.05 0 .09-.045.099-.099l.255-2.105-.255-2.154c-.009-.054-.049-.1-.099-.1m1.49.409c-.064 0-.115.052-.115.115l-.193 1.745.193 1.688c0 .064.051.115.115.115s.115-.051.115-.115l.214-1.688-.214-1.745c0-.063-.051-.115-.115-.115m1.455.247c-.067 0-.122.054-.122.121l-.184 1.498.184 1.446c0 .067.055.121.122.121.066 0 .121-.054.121-.121l.204-1.446-.204-1.498c0-.067-.055-.121-.121-.121m1.43.24c-.069 0-.125.056-.125.125l-.172 1.258.172 1.228c0 .069.056.125.125.125s.125-.056.125-.125l.194-1.228-.194-1.258c0-.069-.056-.125-.125-.125m1.418.196c-.073 0-.132.059-.132.132l-.158 1.062.158 1.04c0 .073.059.132.132.132.072 0 .131-.059.131-.132l.178-1.04-.178-1.062c0-.073-.059-.132-.131-.132m1.402.177c-.077 0-.139.062-.139.139l-.144.885.144.877c0 .077.062.139.139.139.077 0 .139-.062.139-.139l.163-.877-.163-.885c0-.077-.062-.139-.139-.139" />
      </svg>
    ),
    color: "#FF8C00",
  },
};

export const MusicIntegrations: React.FC<MusicIntegrationsProps> = ({
  className,
}) => {
  const {
    musicIntegrations,
    connectSpotify,
    connectAppleMusic,
    connectYouTubeMusic,
    connectSoundCloud,
    disconnectMusicService,
    isLoading,
  } = useAuth();

  const handleConnect = (provider: MusicProvider) => {
    switch (provider) {
      case "spotify":
        connectSpotify();
        break;
      case "apple-music":
        connectAppleMusic();
        break;
      case "youtube-music":
        connectYouTubeMusic();
        break;
      case "soundcloud":
        connectSoundCloud();
        break;
    }
  };

  const handleDisconnect = (provider: MusicProvider) => {
    disconnectMusicService(provider);
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <Text variant="subtitle" as="h3">
          Music Services
        </Text>
        <Text variant="caption" color="secondary">
          Connect your music streaming services to share and discover music
        </Text>
      </div>

      <div className={styles.integrations}>
        {(Object.keys(musicProviderConfig) as MusicProvider[]).map(
          (provider) => {
            const config = musicProviderConfig[provider];
            const integration = musicIntegrations[provider];

            return (
              <div key={provider} className={styles.integration}>
                <div className={styles.providerInfo}>
                  <div className={styles.providerIcon}>{config.icon}</div>
                  <div className={styles.providerDetails}>
                    <Text variant="body" weight="medium">
                      {config.name}
                    </Text>
                    {integration.isConnected ? (
                      <Text variant="caption" color="success">
                        Connected{" "}
                        {integration.displayName &&
                          `as ${integration.displayName}`}
                      </Text>
                    ) : (
                      <Text variant="caption" color="secondary">
                        Not connected
                      </Text>
                    )}
                  </div>
                </div>

                <div className={styles.actions}>
                  {integration.isConnected ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(provider)}
                      disabled={isLoading}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConnect(provider)}
                      disabled={isLoading}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
