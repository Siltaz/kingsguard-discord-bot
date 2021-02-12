SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS guilds;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE guilds (
    guild_id VARCHAR(100) NOT NULL PRIMARY KEY,
    guild_owner_id VARCHAR(100) NOT NULL
);

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS guild_configs;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE guild_configs (
    guild_id VARCHAR(100) NOT NULL PRIMARY KEY,
    prefix VARCHAR(10) DEFAULT '?',
    welcome_channel VARCHAR(100),
    goodbye_channel VARCHAR(100),
    FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE  
);

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS role_channels;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE role_channels (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    channel_id VARCHAR(100) NOT NULL,
    heading VARCHAR(200) NOT NULL,
    guild_id VARCHAR(100) NOT NULL,
    FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE,
    UNIQUE (channel_id, guild_id)
);

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS reaction_roles;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE reaction_roles (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    role VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    emoji VARCHAR(100) NOT NULL,
    guild_id VARCHAR(100) NOT NULL,
    role_channel_id VARCHAR(64) NOT NULL,
    FOREIGN KEY (role_channel_id) REFERENCES role_channels(id) ON DELETE CASCADE,
    UNIQUE (role, role_channel_id)
);

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS bot_channels;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE bot_channels (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    channel_id VARCHAR(100) NOT NULL,
    bot_name VARCHAR(100) NOT NULL,
    guild_id VARCHAR(100) NOT NULL,
    FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE,
    UNIQUE (channel_id, guild_id)
);

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS channel_prefixes;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE channel_prefixes (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    prefix VARCHAR(100) NOT NULL,
    bot_channel_id VARCHAR(64) NOT NULL,
    FOREIGN KEY (bot_channel_id) REFERENCES bot_channels(id) ON DELETE CASCADE,
    UNIQUE (prefix, bot_channel_id)
);