import type PocketBase, { AuthModel } from 'pocketbase'

declare global {
    namespace App {
        export interface Locals {
            pb: PocketBase;
            user: AuthModel;
        }
    }
}