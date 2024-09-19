// src/config/configuration.ts

/**
 * Unique identifier of the token configuration.
 */
export const kid: string = '66cd845a5d16690033a4e24a';

/**
 * Public key generated as part of token configuration.
 */
export const public_key: string =
    '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmKE3dw/9KrH3KMUAc7PUdOUs/82s4BPa9mQCK2p4LAKrwZrr+thHqhFVsA/jbGQFEPusY9sGnx1fCl7i2GvnLyNkl6YH358QQDSXdA89cRprzyWaFevZfGM1QCSQYtEtly1e+ojCVvOsuPsfhjfPksArLfNtdrVp9YZ0TC4q4XJ+tXuw08cLobI4ciVsNHEYk1tKT6lZpVCJUqf1fh2uxkV7PM15I6jdnjKyhS3fn0WBZ8v75w+8A5V+3UqAymHUSal310TVs8tOFx6pp4j96Dwpytyq37SP+x5dhpF/9yzobllNd2oF8taDZ9jsjCYvi1HSFeQSHaC4dSB4izp//QIDAQAB-----END PUBLIC KEY-----';

/**
 * Sample of the Filter object
 * Please refer to documentation for details
 * https://sisense.dev/reference/js/metadata-item.html
 * https://sisense.dev/reference/jaql/
 */
export const sampleFltObject = {
    jaql: {
        table: "Commerce",
        column: "Condition",
        dim: "[Commerce.Condition]",
        datatype: "text",
        filter: {
            members: ["New"],
        },
        title: "Condition",
    },
};

/**
 * Token payload.
 */
export const token_payload = {
    // Sisense user id in that is associated with the token
    sub: "662649062a5342002da57e0b",
    // Time to live for the token. The timestamp at which the token will expire (not exists = infinite)
    exp: 4475878357,
    // Token not before time, or the time before which the WAT will NOT be accepted. Measured as seconds since epoch
    nbf: 1475878357,
    // The list of permissions that the token grants
    grants: {
        // List of Dashboard IDs of the assets allowed to be accessed via token
        res: ["dashboards/66989db977face003324f1e7"],
        // Dashboard / Widget filters
        flt: [sampleFltObject],
        // Permissions set / grants (for dashboard/widget context)
        // Possible values ["filter", "export"]
        prm: ["filter"]
    }
};
