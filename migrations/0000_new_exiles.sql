CREATE TABLE `bookmarks` (
	`recipe_id` integer,
	`user_id` integer,
	`created_at` integer DEFAULT current_timestamp NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `recipe_id`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`user_id` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	`rating` real NOT NULL,
	`created_at` integer DEFAULT current_timestamp NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `recipe_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`name` text NOT NULL,
	`description` text DEFAULT null,
	`body` text DEFAULT null,
	`private` integer DEFAULT false,
	`created_at` integer DEFAULT current_timestamp NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`ip_address` text,
	`signin_at` integer DEFAULT current_timestamp NOT NULL,
	`signout_at` integer DEFAULT null,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`recipe_id` integer,
	`name` text,
	`created_at` integer DEFAULT current_timestamp NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`recipe_id`, `name`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text(100),
	`name` text(250),
	`email` text(250) NOT NULL,
	`avatar` blob,
	`bio` text,
	`avatar_url` text,
	`google_id` text,
	`created_at` integer DEFAULT current_timestamp NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_user_id_name_unique` ON `recipes` (`user_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);