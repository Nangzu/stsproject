package com.example.stsproject.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class Encrypt {

    // Salt 생성
    public String getSalt() {
        SecureRandom r = new SecureRandom();
        byte[] salt = new byte[20];
        r.nextBytes(salt);

        StringBuffer sb = new StringBuffer();
        for (byte b : salt) {
            sb.append(String.format("%02x", b));
        }

        return sb.toString();
    }

    // SHA-256 알고리즘을 사용하여 비밀번호와 Salt를 암호화
    public String getEncrypt(String pwd, String salt) {
        String result = "";
        try {
            // SHA-256 알고리즘 객체 생성
            MessageDigest md = MessageDigest.getInstance("SHA-256");

            // 비밀번호와 salt 합친 문자열에 SHA-256 적용
            md.update((pwd + salt).getBytes());
            byte[] pwdsalt = md.digest();

            // byte[]를 16진수 문자열로 변환
            StringBuffer sb = new StringBuffer();
            for (byte b : pwdsalt) {
                sb.append(String.format("%02x", b));
            }

            result = sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return result;
    }
}
